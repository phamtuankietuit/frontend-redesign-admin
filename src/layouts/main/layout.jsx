import { useSelector } from 'react-redux';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { usePathname } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import { _notifications } from 'src/_mock';
import { selectAuth } from 'src/state/auth/auth.slice';
import { useSearchProducts } from 'src/actions/product';

import { Logo } from 'src/components/logo';

import { Main } from './main';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { _account } from '../config-nav-account';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { navData as mainNavData } from '../config-nav-main';
import { SignInButton } from '../components/sign-in-button';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { SearchHome } from '../components/search-home/search-home';
import { NotificationsDrawer } from '../components/notifications-drawer';

// ----------------------------------------------------------------------

export function MainLayout({ sx, data, children, header }) {
  const theme = useTheme();

  const pathname = usePathname();

  const mobileNavOpen = useBoolean();

  const homePage = pathname === '/';

  const layoutQuery = 'sm';

  const navData = data?.nav ?? mainNavData;

  const { user } = useSelector(selectAuth);

  // SearchHome
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);
  const debouncedQuery = useDebounce(searchQuery);
  const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}
                  open={mobileNavOpen.value}
                  onClose={mobileNavOpen.onFalse}
                />
                {/* -- Logo -- */}
                <Logo />
              </>
            ),
            centerArea: (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                }}
              >
                {/* -- Nav desktop -- */}
                <NavDesktop
                  data={navData}
                  sx={{
                    display: 'none',
                    [theme.breakpoints.up(layoutQuery)]: {
                      mr: 2.5,
                      display: 'flex',
                    },
                  }}
                />
                <SearchHome
                  query={debouncedQuery}
                  results={searchResults}
                  onSearch={handleSearch}
                  loading={searchLoading}
                />
              </Box>
            ),
            rightArea: (
              <Box
                display="flex"
                alignItems="center"
                gap={{ xs: 0, sm: 0.75, md: 1.25 }}
              >
                {user && <NotificationsDrawer data={_notifications} />}
                <SettingsButton />
                {!user && <SignInButton />}
                {user && <AccountDrawer data={_account} />}
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={
        homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />
      }
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
