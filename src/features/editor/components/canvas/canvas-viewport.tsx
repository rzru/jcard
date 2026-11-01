import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

const MIN_SHEET_WIDTH = 160;
const VIEWPORT_GUTTER = 96;

type CanvasViewportProps = {
  readonly aspectRatio: number;
  readonly children: ReactNode;
  readonly heightLabel: string;
  readonly onBackgroundPointerDown: () => void;
  readonly widthLabel: string;
  readonly zoom: number;
};

export function CanvasViewport({
  aspectRatio,
  children,
  heightLabel,
  onBackgroundPointerDown,
  widthLabel,
  zoom,
}: CanvasViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fitWidth, setFitWidth] = useState(600);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (viewport === null) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFitWidth(
        Math.max(
          MIN_SHEET_WIDTH,
          Math.min(width - VIEWPORT_GUTTER, (height - VIEWPORT_GUTTER) * aspectRatio),
        ),
      );
    });

    observer.observe(viewport);
    return () => observer.disconnect();
  }, [aspectRatio]);

  const stageStyle: CSSProperties = {
    width: `${fitWidth * (zoom / 100)}px`,
  };

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onBackgroundPointerDown();
    }
  }

  return (
    <div ref={viewportRef} className="canvas-viewport" onPointerDown={handlePointerDown}>
      <div className="canvas-plane">
        <div className="sheet-stage" style={stageStyle}>
          <div className="canvas-measure" aria-hidden="true">
            <span>{widthLabel}</span>
            <i />
            <span>{heightLabel}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
