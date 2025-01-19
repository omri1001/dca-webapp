import { Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { AppButton, AppView } from '@/components';
import { getCurrentVersion } from '@/utils';

/**
 * Renders "About" views
 * url: /about
 * @page About
 */
const AboutView = () => {
  return (
    <AppView>
      <Card>
        <CardHeader title="בפיתוח" subheader={`Version ${getCurrentVersion()}`} />
        <CardContent>TODO:</CardContent>
        <CardActions>
          <AppButton to="/" color="primary">
            OK
          </AppButton>
        </CardActions>
      </Card>
    </AppView>
  );
};

export default AboutView;
