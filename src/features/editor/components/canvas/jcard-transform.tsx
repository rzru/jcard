import { useRef, type PointerEvent, type ReactNode } from 'react';

import { mirroredRect, type CanvasRect } from '../../model/editor-model';

type ResizeEdge = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export type AlignmentGuides = {
  readonly x?: number;
  readonly y?: number;
};

type AxisLock = {
  readonly axis: 'x' | 'y';
  readonly guide: number;
  readonly position: number;
};

type SnapTargets = {
  readonly x: readonly number[];
  readonly y: readonly number[];
};

type TransformLayerProps = {
  readonly boundsHeight: number;
  readonly boundsWidth: number;
  readonly children: ReactNode;
  readonly className: string;
  readonly interactive: boolean;
  readonly label: string;
  readonly mirrored?: boolean;
  readonly panelWidths: readonly number[];
  readonly rect: CanvasRect;
  readonly rotation?: number;
  readonly selected: boolean;
  readonly onChange: (rect: CanvasRect) => void;
  readonly onChangeStart: () => void;
  readonly onDoubleClick?: () => void;
  readonly onGuidesChange: (guides: AlignmentGuides) => void;
  readonly onSelect: () => void;
};

const RESIZE_EDGES: readonly ResizeEdge[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
const MIN_LAYER_SIZE = 2;
const SNAP_THRESHOLD_PX = 6;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

type PanelBounds = {
  readonly start: number;
  readonly end: number;
};

function getPanelBounds(panelWidths: readonly number[]): readonly PanelBounds[] {
  let start = 0;

  return panelWidths.map((width) => {
    const panel = { start, end: start + width };
    start += width;
    return panel;
  });
}

function addPanelRelativeTargets(
  targets: number[],
  anchors: readonly number[],
  sourcePanel: PanelBounds,
  panels: readonly PanelBounds[],
) {
  for (const panel of panels) {
    for (const anchor of anchors) {
      const projected = panel.start + anchor - sourcePanel.start;
      if (projected >= panel.start && projected <= panel.end) {
        targets.push(projected);
      }
    }
  }
}

function collectSnapTargets(
  sheet: Element,
  currentLayer: Element,
  panelWidths: readonly number[],
  canvasBounds: Pick<CanvasRect, 'width' | 'height'>,
): SnapTargets {
  const sheetBounds = sheet.getBoundingClientRect();
  const panels = getPanelBounds(panelWidths);
  const x = [0];

  for (const panel of panels) {
    x.push((panel.start + panel.end) / 2, panel.end);
  }

  const y = [0, canvasBounds.height / 2, canvasBounds.height];

  for (const layer of sheet.querySelectorAll('[data-align-layer]')) {
    if (layer === currentLayer) {
      continue;
    }

    const bounds = layer.getBoundingClientRect();
    const left = ((bounds.left - sheetBounds.left) / sheetBounds.width) * canvasBounds.width;
    const top = ((bounds.top - sheetBounds.top) / sheetBounds.height) * canvasBounds.height;
    const width = (bounds.width / sheetBounds.width) * canvasBounds.width;
    const height = (bounds.height / sheetBounds.height) * canvasBounds.height;
    const horizontalAnchors = [left, left + width / 2, left + width];
    const verticalAnchors = [top, top + height / 2, top + height];
    const sourcePanel = panels.find(
      (panel) => left + width / 2 >= panel.start && left + width / 2 <= panel.end,
    );
    x.push(...horizontalAnchors, ...horizontalAnchors.map((anchor) => canvasBounds.width - anchor));
    y.push(...verticalAnchors, ...verticalAnchors.map((anchor) => canvasBounds.height - anchor));

    if (sourcePanel !== undefined) {
      addPanelRelativeTargets(x, horizontalAnchors, sourcePanel, panels);
    }
  }

  return { x, y };
}

function nearestSnap(anchors: readonly number[], targets: readonly number[], threshold: number) {
  let best: { readonly adjustment: number; readonly guide: number } | undefined;

  for (const anchor of anchors) {
    for (const target of targets) {
      const adjustment = target - anchor;
      if (
        Math.abs(adjustment) <= threshold &&
        Math.abs(adjustment) < Math.abs(best?.adjustment ?? Infinity)
      ) {
        best = { adjustment, guide: target };
      }
    }
  }

  return best;
}

function createAxisLock(
  guides: AlignmentGuides,
  rect: CanvasRect,
  dx: number,
  dy: number,
): AxisLock | undefined {
  let axis: AxisLock['axis'] | undefined;

  if (guides.x !== undefined && guides.y !== undefined) {
    axis = Math.abs(dx) > Math.abs(dy) ? 'y' : 'x';
  } else if (guides.x !== undefined) {
    axis = 'x';
  } else if (guides.y !== undefined) {
    axis = 'y';
  }

  const guide = axis === undefined ? undefined : guides[axis];
  return axis === undefined || guide === undefined
    ? undefined
    : { axis, guide, position: rect[axis] };
}

function axisLockForMove({
  current,
  shiftKey,
  lastGuides,
  lastRect,
  guides,
  rect,
  dx,
  dy,
}: {
  readonly current?: AxisLock;
  readonly shiftKey: boolean;
  readonly lastGuides: AlignmentGuides;
  readonly lastRect: CanvasRect;
  readonly guides: AlignmentGuides;
  readonly rect: CanvasRect;
  readonly dx: number;
  readonly dy: number;
}) {
  return shiftKey
    ? (current ??
        createAxisLock(lastGuides, lastRect, dx, dy) ??
        createAxisLock(guides, rect, dx, dy))
    : undefined;
}

function applyAxisLock(rect: CanvasRect, guides: AlignmentGuides, lock: AxisLock | undefined) {
  if (lock === undefined) {
    return { rect, guides };
  }

  return lock.axis === 'x'
    ? { rect: { ...rect, x: lock.position }, guides: { ...guides, x: lock.guide } }
    : { rect: { ...rect, y: lock.position }, guides: { ...guides, y: lock.guide } };
}

function rotatedBounds(rect: CanvasRect, rotation: number): CanvasRect {
  const radians = (rotation * Math.PI) / 180;
  const width =
    Math.abs(rect.width * Math.cos(radians)) + Math.abs(rect.height * Math.sin(radians));
  const height =
    Math.abs(rect.width * Math.sin(radians)) + Math.abs(rect.height * Math.cos(radians));

  return {
    x: rect.x + (rect.width - width) / 2,
    y: rect.y + (rect.height - height) / 2,
    width,
    height,
  };
}

function snapRect(
  rect: CanvasRect & { readonly rotation?: number },
  targets: SnapTargets,
  thresholdX: number,
  thresholdY: number,
): { readonly rect: CanvasRect; readonly guides: AlignmentGuides } {
  const bounds = rotatedBounds(rect, rect.rotation ?? 0);
  const horizontal = nearestSnap(
    [bounds.x, bounds.x + bounds.width / 2, bounds.x + bounds.width],
    targets.x,
    thresholdX,
  );
  const vertical = nearestSnap(
    [bounds.y, bounds.y + bounds.height / 2, bounds.y + bounds.height],
    targets.y,
    thresholdY,
  );

  return {
    rect: {
      x: rect.x + (horizontal?.adjustment ?? 0),
      y: rect.y + (vertical?.adjustment ?? 0),
      width: rect.width,
      height: rect.height,
    },
    guides: { x: horizontal?.guide, y: vertical?.guide },
  };
}

type ResizeAxisInput = {
  readonly position: number;
  readonly size: number;
  readonly delta: number;
  readonly resizeNear: boolean;
  readonly resizeFar: boolean;
  readonly maximum: number;
  readonly targets: readonly number[];
  readonly threshold: number;
};

type ResizeRectInput = {
  readonly rect: CanvasRect;
  readonly edge: ResizeEdge;
  readonly dx: number;
  readonly dy: number;
  readonly boundsWidth: number;
  readonly boundsHeight: number;
  readonly targets: SnapTargets;
  readonly thresholdX: number;
  readonly thresholdY: number;
};

function resizeAxis({
  position,
  size,
  delta,
  resizeNear,
  resizeFar,
  maximum,
  targets,
  threshold,
}: ResizeAxisInput): { readonly position: number; readonly size: number; readonly guide?: number } {
  if (!resizeNear && !resizeFar) {
    return { position, size };
  }

  const fixedFar = position + size;
  let nextPosition = resizeNear ? clamp(position + delta, 0, fixedFar - MIN_LAYER_SIZE) : position;
  let nextSize = resizeNear
    ? fixedFar - nextPosition
    : clamp(size + delta, MIN_LAYER_SIZE, maximum - position);
  const anchor = resizeNear ? nextPosition : nextPosition + nextSize;
  const snap = nearestSnap([anchor], targets, threshold);

  if (snap === undefined) {
    return { position: nextPosition, size: nextSize };
  }

  if (resizeNear) {
    nextPosition = clamp(nextPosition + snap.adjustment, 0, fixedFar - MIN_LAYER_SIZE);
    nextSize = fixedFar - nextPosition;
  } else {
    nextSize = clamp(nextSize + snap.adjustment, MIN_LAYER_SIZE, maximum - nextPosition);
  }

  return { position: nextPosition, size: nextSize, guide: snap.guide };
}

function resizeRect({
  rect,
  edge,
  dx,
  dy,
  boundsWidth,
  boundsHeight,
  targets,
  thresholdX,
  thresholdY,
}: ResizeRectInput): { readonly rect: CanvasRect; readonly guides: AlignmentGuides } {
  const horizontal = resizeAxis({
    position: rect.x,
    size: rect.width,
    delta: dx,
    resizeNear: edge.includes('w'),
    resizeFar: edge.includes('e'),
    maximum: boundsWidth,
    targets: targets.x,
    threshold: thresholdX,
  });
  const vertical = resizeAxis({
    position: rect.y,
    size: rect.height,
    delta: dy,
    resizeNear: edge.includes('n'),
    resizeFar: edge.includes('s'),
    maximum: boundsHeight,
    targets: targets.y,
    threshold: thresholdY,
  });

  return {
    rect: {
      x: horizontal.position,
      y: vertical.position,
      width: horizontal.size,
      height: vertical.size,
    },
    guides: { x: horizontal.guide, y: vertical.guide },
  };
}

export function TransformLayer({
  boundsHeight,
  boundsWidth,
  children,
  className,
  interactive,
  label,
  mirrored = false,
  onChange,
  onChangeStart,
  onDoubleClick,
  onGuidesChange,
  onSelect,
  panelWidths,
  rect,
  rotation = 0,
  selected,
}: TransformLayerProps) {
  const viewRect = mirrored ? mirroredRect(rect, boundsWidth) : rect;
  const viewRotation = mirrored ? -rotation : rotation;
  const viewPanelWidths = mirrored ? panelWidths.toReversed() : panelWidths;
  const dragRef = useRef<
    | {
        axisLock?: AxisLock;
        changed: boolean;
        readonly edge?: ResizeEdge;
        lastGuides: AlignmentGuides;
        lastRect: CanvasRect;
        readonly pointerX: number;
        readonly pointerY: number;
        readonly rect: CanvasRect;
        readonly targets: SnapTargets;
      }
    | undefined
  >(undefined);

  function startTransform(event: PointerEvent<HTMLElement>, edge?: ResizeEdge) {
    if (!interactive || event.button !== 0 || event.detail > 1) {
      return;
    }

    const sheet = event.currentTarget.closest('.jcard-sheet');
    const layer = event.currentTarget.closest('[data-align-layer]');

    if (sheet === null || layer === null) {
      return;
    }

    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const targets = collectSnapTargets(sheet, layer, viewPanelWidths, {
      width: boundsWidth,
      height: boundsHeight,
    });
    const sheetBounds = sheet.getBoundingClientRect();
    const alignment = snapRect(
      { ...viewRect, rotation: viewRotation },
      targets,
      (SNAP_THRESHOLD_PX / sheetBounds.width) * boundsWidth,
      (SNAP_THRESHOLD_PX / sheetBounds.height) * boundsHeight,
    );
    dragRef.current = {
      changed: false,
      edge,
      lastGuides: alignment.guides,
      lastRect: alignment.rect,
      pointerX: event.clientX,
      pointerY: event.clientY,
      rect: viewRect,
      targets,
    };
    onGuidesChange({});
    onSelect();
  }

  function moveTransform(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    const sheet = event.currentTarget.closest('.jcard-sheet');

    if (drag === undefined || sheet === null) {
      return;
    }

    const sheetBounds = sheet.getBoundingClientRect();
    const dx = ((event.clientX - drag.pointerX) / sheetBounds.width) * boundsWidth;
    const dy = ((event.clientY - drag.pointerY) / sheetBounds.height) * boundsHeight;
    let { x, y, width, height } = drag.rect;

    if (drag.edge === undefined) {
      x = clamp(drag.rect.x + dx, 0, boundsWidth - width);
      y = clamp(drag.rect.y + dy, 0, boundsHeight - height);
      const snapped = snapRect(
        { x, y, width, height, rotation: viewRotation },
        drag.targets,
        (SNAP_THRESHOLD_PX / sheetBounds.width) * boundsWidth,
        (SNAP_THRESHOLD_PX / sheetBounds.height) * boundsHeight,
      );
      drag.axisLock = axisLockForMove({
        current: drag.axisLock,
        shiftKey: event.shiftKey,
        lastGuides: drag.lastGuides,
        lastRect: drag.lastRect,
        guides: snapped.guides,
        rect: snapped.rect,
        dx,
        dy,
      });
      const constrained = applyAxisLock(snapped.rect, snapped.guides, drag.axisLock);
      ({ x, y } = constrained.rect);
      drag.lastGuides = constrained.guides;
      drag.lastRect = constrained.rect;
      onGuidesChange(constrained.guides);
    } else {
      const resized = resizeRect({
        rect: drag.rect,
        edge: drag.edge,
        dx,
        dy,
        boundsWidth,
        boundsHeight,
        targets: drag.targets,
        thresholdX: (SNAP_THRESHOLD_PX / sheetBounds.width) * boundsWidth,
        thresholdY: (SNAP_THRESHOLD_PX / sheetBounds.height) * boundsHeight,
      });
      ({ x, y, width, height } = resized.rect);
      onGuidesChange(resized.guides);
    }

    if (!drag.changed) {
      drag.changed = true;
      onChangeStart();
    }
    onChange(
      mirrored ? mirroredRect({ x, y, width, height }, boundsWidth) : { x, y, width, height },
    );
  }

  function stopTransform(event: PointerEvent<HTMLElement>) {
    if (dragRef.current === undefined) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = undefined;
    onGuidesChange({});
  }

  return (
    <div
      className={`${className}${selected ? ' is-selected' : ''}`}
      data-align-layer
      style={{
        left: `${(viewRect.x / boundsWidth) * 100}%`,
        top: `${(viewRect.y / boundsHeight) * 100}%`,
        width: `${(viewRect.width / boundsWidth) * 100}%`,
        height: `${(viewRect.height / boundsHeight) * 100}%`,
        transform: `rotate(${viewRotation}deg)`,
      }}
      onDoubleClick={onDoubleClick}
      onPointerDown={startTransform}
      onPointerMove={moveTransform}
      onPointerUp={stopTransform}
      onPointerCancel={stopTransform}
    >
      {interactive ? (
        <button
          className="transform-selector"
          type="button"
          aria-label={label}
          aria-pressed={selected}
          onClick={onSelect}
        />
      ) : null}
      <span className="transform-content">{children}</span>
      {!interactive || !selected
        ? null
        : RESIZE_EDGES.map((edge) => (
            <button
              className={`transform-handle handle-${edge}`}
              type="button"
              aria-label={`Resize ${edge}`}
              key={edge}
              onPointerDown={(event) => startTransform(event, edge)}
              onPointerMove={moveTransform}
              onPointerUp={stopTransform}
              onPointerCancel={stopTransform}
            />
          ))}
    </div>
  );
}
