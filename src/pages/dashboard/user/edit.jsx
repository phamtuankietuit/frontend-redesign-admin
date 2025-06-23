import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { UserEditView } from 'src/sections/user/view';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'src/state/user/user.slice';
import { getUserByIdAsync } from 'src/services/user/user.service';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

const metadata = { title: `Thông tin khách hàng - ${CONFIG.appName}` };

export default function Page() {
  const dispatch = useDispatch();

  const { user } = useSelector(selectUser);

  const { id = '' } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getUserByIdAsync(id));
    }
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={user} />
    </>
  );
}
