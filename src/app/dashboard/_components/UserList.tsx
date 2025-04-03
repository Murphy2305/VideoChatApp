"use client";
import Image from "next/image";
import { Video } from "lucide-react";
import { useState } from "react";
import { useSocket } from "@/context/context";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser

const UserList = () => {
  const [showAll, setShowAll] = useState(false);
  const { user } = useUser(); // Get the signed-in user
  const { onlineUsers: users , handleCall } = useSocket();
  
  // Filter out the signed-in user
  const filteredUsers = (users || []).filter((u) => u.userId !== user?.id);
  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 6);

  return (
    <div className="min-w-[250px] max-w-sm shadow-md rounded-lg p-5 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold text-gray-900 dark:text-white">
          Online Users
        </h5>
        {!showAll && filteredUsers.length > 6 && (
          <button
            onClick={() => setShowAll(true)}
            className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
          >
            View all
          </button>
        )}
      </div>
      <div className="flow-root flex-grow">
        {filteredUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedUsers.map((User, index) => (
              <li key={index} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <Image
                      alt={"profile image"}
                      height={32}
                      width={32}
                      src={User.profile.imageUrl}
                      className="rounded-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {User?.profile?.fullName}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {User.profile.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                  <button className="p-2 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => handleCall(User)}>
                    <Video size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No online users available
          </p>
        )}
      </div>
    </div>
  );
};

export default UserList;