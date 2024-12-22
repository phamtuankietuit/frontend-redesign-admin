import { Suspense } from 'react';
import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SimpleLayout } from 'src/layouts/simple';
import { getUserRole } from 'src/services/token.service';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { SplashScreen } from 'src/components/loading-screen';
import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function RoleBasedGuard({
  sx,
  children,
  hasContent,
  currentRole,
  acceptRoles,
}) {
  if (
    typeof acceptRoles !== 'undefined' &&
    !acceptRoles.includes(getUserRole())
  ) {
    return hasContent ? (
      <Suspense fallback={<SplashScreen />}>
        <SimpleLayout>
          <Container
            component={MotionContainer}
            sx={{ textAlign: 'center', ...sx }}
          >
            <m.div variants={varBounce().in}>
              <Typography variant="h3" sx={{ mb: 2 }}>
                Không thể truy cập
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <Typography sx={{ color: 'text.secondary' }}>
                Bạn không có quyền truy cập trang này.
              </Typography>
            </m.div>

            <m.div variants={varBounce().in}>
              <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
            </m.div>
          </Container>
        </SimpleLayout>
      </Suspense>
    ) : null;
  }

  return <> {children} </>;
}
