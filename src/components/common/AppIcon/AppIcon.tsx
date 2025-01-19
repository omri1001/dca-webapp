import { ComponentType, FunctionComponent, SVGAttributes } from 'react';
import { APP_ICON_SIZE } from '@/components/config';
import { IconName, ICONS } from './config';

export interface AppIconProps extends SVGAttributes<SVGElement> {
  color?: string;
  icon: IconName;
  size?: string | number;
  title?: string;
}

const AppIcon: FunctionComponent<AppIconProps> = ({
                                                    color,
                                                    icon,
                                                    size = APP_ICON_SIZE,
                                                    style,
                                                    ...restOfProps
                                                  }) => {
  // 1) If icon is "dca_logo_png", render the PNG
  if (icon === 'dca_logo_png') {
    return (
        <img
            src="/img/favicon/dca_logo.png"
            alt="DCA Logo"
            // Let size control the width/height
            style={{
              ...style,
              width: size,
              height: size,
              objectFit: 'contain', // optional, keeps aspect ratio
            }}
            {...restOfProps}
        />
    );
  }

  // 2) Otherwise, fall back to the usual SVG logic
  let ComponentToRender: ComponentType = ICONS[icon];
  if (!ComponentToRender) {
    console.warn(`AppIcon: icon "${icon}" not found!`);
    ComponentToRender = ICONS.default;
  }

  const propsToRender = {
    height: size,
    width: size,
    color,
    fill: color && 'currentColor', // If color is set, fill the icon with 'currentColor'
    size,
    style: { ...style, color },
    ...restOfProps,
  };

  return <ComponentToRender data-icon={icon} {...propsToRender} />;
};

export default AppIcon;
