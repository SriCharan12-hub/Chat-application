import {BellIcon} from "lucide-react";

const NoNotificationsFound = () => {
  return (
   <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <BellIcon className="size-8 text-base-content"/>
    </div>
    <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
    <p className="text-base-content opacity-70 max-w-md">When you receive friend requests or connection updates, they'll appear here.</p>
   </div>
  )
}

export default NoNotificationsFound