import { FunctionComponent } from 'react';
import { IconProps } from '../utils';

const YellowPlaneIcon: FunctionComponent<IconProps> = (props) => {
    return (
        <img
            src="/img/favicon/dca_logo.png"
            alt="DCA Logo"
            width={100}      // set default width here
            height={200}     // set default height here
            {...props}      // allow overriding (e.g. <YellowPlaneIcon width={100} />)
        />
    );
};

export default YellowPlaneIcon;
