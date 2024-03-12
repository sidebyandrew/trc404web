// UserList.tsx
import React from 'react';

interface User {
  id: number;
  name: string;
  introduction: string;
  imageUrl: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center rounded bg-gray-200 p-4 shadow-md"
        >
          {/* User Image */}
          <img
            src={user.imageUrl}
            alt={`Image of ${user.name}`}
            className="mr-4 h-16 w-16 rounded-full"
          />

          {/* Name and Introduction */}
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-gray-600">{user.introduction}</p>
          </div>

          {/* Action Button */}
          <button className="ml-auto rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Action
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
