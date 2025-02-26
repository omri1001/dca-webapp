import { ComponentType, FunctionComponent } from 'react';
import { APP_ICON_SIZE } from '@/components/config';
import { IconName, ICONS } from './config';

// Extend the icon names to include the PNG case.
export type ExtendedIconName = IconName | "dca_logo_png";

interface CommonProps {
    icon: ExtendedIconName;
    color?: string;
    size?: string | number;
    title?: string;
}

// When icon is "dca_logo_png", we expect image attributes.
type AppIconImgProps = CommonProps &
    React.ImgHTMLAttributes<HTMLImageElement> & {
    icon: "dca_logo_png";
};

// For any other icon, we use SVG attributes.
type AppIconSVGProps = CommonProps &
    React.SVGProps<SVGSVGElement> & {
    icon: Exclude<ExtendedIconName, "dca_logo_png">;
};

export type AppIconProps = AppIconImgProps | AppIconSVGProps;

const AppIcon: FunctionComponent<AppIconProps> = (props) => {
    const { color, icon, size = APP_ICON_SIZE, style, ...restOfProps } = props;

    // Render the PNG if the icon is "dca_logo_png"
    if (icon === "dca_logo_png") {
        // Assert that restOfProps are valid image props.
        const imgProps = restOfProps as React.ImgHTMLAttributes<HTMLImageElement>;
        return (
            <img
                src="/img/favicon/dca_logo.png"
                alt="DCA Logo"
                style={{
                    ...style,
                    width: size,
                    height: size,
                    objectFit: 'contain', // Keeps aspect ratio
                }}
                {...imgProps}
            />
        );
    }

    // Otherwise, render the corresponding SVG.
    let ComponentToRender: ComponentType = ICONS[icon];
    if (!ComponentToRender) {
        console.warn(`AppIcon: icon "${icon}" not found!`);
        ComponentToRender = ICONS.default;
    }

    const svgProps = {
        height: size,
        width: size,
        color,
        fill: color ? 'currentColor' : undefined,
        style: { ...style, color },
        ...restOfProps,
    };

    return <ComponentToRender data-icon={icon} {...svgProps} />;
};

export default AppIcon;
