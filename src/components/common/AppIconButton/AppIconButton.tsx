import { ElementType, FunctionComponent, useMemo } from 'react';
import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
} from '@mui/material';
import { alpha } from '@mui/material';
import { AppIcon, AppLink } from '@/components';
import { IconName } from '../AppIcon/config';
import { AppIconProps } from '../AppIcon/AppIcon';
import { MUI_ICON_BUTTON_COLORS } from './utils';

export interface AppIconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  color?: string;
  icon: IconName | 'dca_logo_png';
  iconProps?: Partial<AppIconProps>;
  component?: ElementType; // Could be RouterLink, AppLink, <a>, etc.
  to?: string; // Link prop
  href?: string; // Link prop
  openInNewTab?: boolean; // Link prop
  tooltipProps?: Partial<MuiTooltipProps>;
}

/**
 * Renders MUI IconButton with SVG image (AppIcon) by default,
 * but will render a PNG if `icon` is set to "dca_logo_png".
 */
const AppIconButton: FunctionComponent<AppIconButtonProps> = ({
                                                                color = 'default',
                                                                component,
                                                                children,
                                                                disabled,
                                                                icon,
                                                                iconProps,
                                                                sx,
                                                                title,
                                                                tooltipProps,
                                                                ...restOfProps
                                                              }) => {
  const componentToRender =
      !component && (restOfProps?.href || restOfProps?.to)
          ? AppLink // Use AppLink when .href or .to is set
          : (component ?? MuiIconButton);

  const isMuiColor = useMemo(() => MUI_ICON_BUTTON_COLORS.includes(color), [color]);

  const iconButtonToRender = useMemo(() => {
    const colorToRender = isMuiColor ? (color as MuiIconButtonProps['color']) : 'default';

    const sxToRender = {
      ...sx,
      // If color is NOT a standard MUI color, apply custom color & hover
      ...(!isMuiColor && {
        color: color,
        ':hover': {
          backgroundColor: alpha(color, 0.04),
        },
      }),
    };

    return (
        <MuiIconButton
            component={componentToRender}
            color={colorToRender}
            disabled={disabled}
            sx={sxToRender}
            {...restOfProps}
        >
          {icon === 'dca_logo_png' ? (
              // --- Use your PNG instead of AppIcon ---
              <img
                  src="/img/favicon/dca_logo.png"
                  alt="DCA Logo"
                  style={{
                    // You can override width/height here or via iconProps
                    width: 100,
                    height: 100,
                    objectFit: 'contain',
                  }}
              />
          ) : (
              // --- Default fallback: use the normal AppIcon (SVG) ---
              <AppIcon icon={icon} {...iconProps} />
          )}
          {children}
        </MuiIconButton>
    );
  }, [
    color,
    componentToRender,
    children,
    disabled,
    icon,
    isMuiColor,
    sx,
    iconProps,
    restOfProps,
  ]);

  // Wrap in a Tooltip if `title` is set and the button isn’t disabled
  return title && !disabled ? (
      <MuiTooltip title={title} {...tooltipProps}>
        {iconButtonToRender}
      </MuiTooltip>
  ) : (
      iconButtonToRender
  );
};

export default AppIconButton;
