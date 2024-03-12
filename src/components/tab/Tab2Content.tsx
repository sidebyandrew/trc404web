import { boards } from '@/config/popcoin-data';
import { Avatar, Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Tab2Content: React.FC = () => {
  let router = useRouter();

  return (
    <div className="p-4">
      <div className="mb-3 text-2xl font-bold">Competitions</div>

      <div className="mb-20">
        {boards.map((board) => (
          <div key={board.id} className="flex pb-2">
            <div
              className="group relative "
              onClick={() => {
                router.push('/competition/' + board.id);
              }}
            >
              <img
                src={board.image}
                className="w-38 mb-2 h-44 cursor-pointer rounded object-cover"
              />
              <div className="absolute bottom-2 left-0 w-full bg-black bg-opacity-60 text-white">
                <p className="text-md ml-1 font-bold">{board.title}</p>
                <p className="flex flex-row flex-nowrap text-sm font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className=" h-[19px] w-[19px] "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                    />
                  </svg>

                  {board.count}
                </p>
                <p className="flex flex-row flex-nowrap text-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className=" h-[19px] w-[19px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {board.date}
                </p>
              </div>
            </div>

            <div className=" ml-1 ">
              <div className="mb-1text-sm font-bold">Leaderboard</div>
              {board.users.map((user) => (
                <div
                  key={user.id}
                  className="mb-1 flex flex-nowrap items-start gap-1"
                >
                  <div className="flex-item flex-nowrap">
                    <Image
                      src="/icon/cup.png"
                      alt="rank_orange"
                      className={`${user.rank < 4 ? '' : 'invisible'} h-5 w-5 `}
                    />
                  </div>
                  <div className="flex-item flex-nowrap">
                    <Avatar src={user.img} className="h-6 w-6 text-tiny" />
                  </div>
                  <div className="flex-item flex flex-grow flex-col">
                    <div className="text-sm">{user.name}</div>
                  </div>
                  <div className="flex-item flex flex-grow flex-col">
                    <div className="text-sm">&nbsp;</div>
                  </div>
                  <div className="flex-item flex flex-grow flex-col">
                    <div className="text-sm">&nbsp;</div>
                  </div>
                  <div className="flex-item">{user.score}</div>
                </div>
              ))}
              <div
                className="cursor-pointer text-center text-sm underline"
                onClick={() => {
                  router.push('/competition/' + board.id);
                }}
              >
                See all
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab2Content;
