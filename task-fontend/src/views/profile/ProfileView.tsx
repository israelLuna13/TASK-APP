import ProfileForm from "@/components/profile/ProfileForm"
import { useAuth } from "@/hooks/useAuth"

export default function ProfileView() {
    //our hook, return a user logged
    const {isLoading,data} = useAuth()
    
    if(isLoading) return 'Load ...'
    if(data) return <ProfileForm data={data}/>
}
