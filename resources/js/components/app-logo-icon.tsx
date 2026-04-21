import type { ImgHTMLAttributes } from 'react';

/**
 * SendGate app logo mark. Callers historically passed `className` to the
 * original SVG — that still works. Other SVG-only attributes (fill, stroke,
 * viewBox…) are accepted loosely but ignored since we now render an <img>.
 */
export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement> & Record<string, unknown>,
) {
    // Filter to props that are actually valid on an <img>.
    const {
        className,
        alt,
        src: _src,
        width,
        height,
        draggable,
        style,
        onClick,
        'aria-hidden': ariaHidden,
        'aria-label': ariaLabel,
    } = props;

    return (
        <img
            src="/logo.png"
            alt={alt ?? 'SendGate'}
            width={width ?? 40}
            height={height ?? 40}
            draggable={draggable ?? false}
            style={style}
            onClick={onClick}
            aria-hidden={ariaHidden}
            aria-label={ariaLabel}
            className={className ? `${className} select-none` : 'select-none'}
        />
    );
}
