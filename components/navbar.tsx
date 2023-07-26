import { UserButton, auth } from '@clerk/nextjs';
import cls from 'classnames';
import MainNav from '@/components/mainNav';
import StoreSwitcher from '@/components/store-switcher';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

const Navbar = async() => {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in')
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId
        }
    });

  return (
    <div className={cls(
        "border-b"
    )}>
        <div className={cls(
            'flex h-16 items-center px-4'
        )}>
            <StoreSwitcher
                items={stores}
            />
            <MainNav className='mx-6'/>
            <div className={cls(
                'ml-auto flex items-center space-x-4'
            )}>
                <UserButton afterSignOutUrl='/'/>
            </div>
        </div>
    </div>
  )
}

export default Navbar