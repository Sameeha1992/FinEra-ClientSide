import { authService } from '@/api/AuthServiceAndProfile'
import ChangePassword from '@/components/shared/ChangePassword'

const UserChangePassword = () => {

    const handleChangePassword =async (currentPassword:string,newPassword:string)=>{

        await authService.changePassword({currentPassword,newPassword})

    }
  return (
     <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="ml-56 flex items-center justify-center min-h-screen px-4">
          <ChangePassword onSubmit={handleChangePassword} />
        </div>
      </div>
  )
}

export default UserChangePassword
