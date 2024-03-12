"use client";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image
} from "@nextui-org/react";
import React from "react";
import { Avatar } from "@nextui-org/avatar";
import { useTheme } from "next-themes";

const Tab3Content: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>

      {/*  head start*/}
      <div className="flex justify-between p-4">
        <div className="flex flex-col">
          <div className="text-lg font-bold">
            <Avatar src="/icon/andrew.png" />
            <div className="text-3xl font-bold">Badge Wall</div>
          </div>
          <div className="flex items-center text-sm">
            <Image src={theme === "dark" ? "/icon/badge_white.png" : "/icon/badge_black.png"} height={25} width={25}
                   alt="pop" radius={"full"} />
            <p className=" font-bold">Badge count</p>
          </div>
          <div>
            <div className="ml-1 font-extrabold text-3xl ">8</div>
          </div>
        </div>
        <div className="flex-item ml-auto">
          <Image src="/icon/badge_blink.png" height={121} width={121} alt="badge_blink" />
        </div>
      </div>
      {/*  head end*/}

      {/*  badge wall start */}

      <div className="dark:bg-stone-950 mt-2 ">
      <div className="grid grid-cols-2 gap-4 pt-5 mb-5">
        <div className="flex flex-col items-center">
          <Image src="/icon/badge_RisingStar.png" height={121} width={121} alt="badge_blink" />
          <div  className="mt-4 text-xl font-extrabold">Rising Star</div>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/icon/badge_FriendshipMAX.png" height={121} width={121} alt="badge_blink" />
          <div className="mt-4 text-xl font-extrabold">Friendship MAX</div>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/icon/badge_FrontRunner.png" height={121} width={121} alt="badge_blink" />
          <div  className="mt-4 text-xl font-extrabold">Front Runner</div>
        </div>
        <div className="flex flex-col items-center mb-9">
          <Image src="/icon/badge_RecordKeeper.png" height={121} width={121} alt="badge_blink" />
          <div  className="mt-4 text-xl font-extrabold">Record Keeper</div>
        </div>
      </div>
      </div>



      {/*  badge wall end */}

    </div>
  );
};

export default Tab3Content;
