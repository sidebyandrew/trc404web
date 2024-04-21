'use client';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ClipboardCopyIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BASE_URL } from '@/constant/trc404_config';
import { Result404, User404 } from '@/utils/interface404';
import { REF_USER_LIST_FOUND } from '@/utils/static404';
import { useInitData } from '@tma.js/sdk-react';
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';

const rules = [
  {
    title: 'Invite friends with your personal link.',
    description: '2 points per friends. (Max 1000 points)',
  },
  {
    title: 'Your friends mint a T404!',
    description: 'If your friends mint 1 T404, you will get 50 points reward.',
  },
  {
    title: 'Your friends buy a T404!',
    description: 'If your friends buy 1 T404, you will get 5 points reward.',
  },
  {
    title: 'More rules in brew',
    description: '...',
  },
];

export default function Tab4Airdrop() {

  // /* todo remove tma */
  const tgInitData = useInitData();

  // const tgInitData = { user: { id: 5499157826, username: '' } };


  const [userData, setUserData] = useState<User404>({
    tgId: '',
    tgUsername: '',
    refCode: '',
    refTgId: '',
    refTgUsername: '',
  });
  const [logMsg404, setLogMsg404] = useState('');


  const handleCopy = async () => {
    try {

      if (userData && userData.refCode) {
        let refLink = `https://t.me/trc404bot?start=${userData.refCode}`;
        await navigator.clipboard.writeText(refLink);
        quickToast('Copied!', refLink);
      } else {
        quickToast('Error!', 'please reload and try again!');
      }
    } catch (error) {
      console.error('Fail to copy referral code：', error);
    }
  };


  function quickToast(title: string, description: string) {
    toast({
      title: title,
      description: description,
      action: (
        <ToastAction
          altText="OK">OK</ToastAction>
      ),
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let tgId = tgInitData?.user?.id;
        let tgUsername = tgInitData?.user?.username;
        if (!tgUsername) {
          tgUsername = '' + tgId;
        }

        let urlWithParams = `${BASE_URL}/api/user?tgId=${tgId}&tgUsername=${tgUsername}&access404=error_code_404`;
        const response = await fetch(urlWithParams);
        if (!response.ok) {
          console.error(urlWithParams);
          return;
        }
        const responseData = await response.json<Result404>();
        if (responseData.success && responseData.code == REF_USER_LIST_FOUND) {
          setUserData(responseData.result);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-3">
      <div className="mb-3 text-2xl font-bold">Referral</div>
      {/* Div Card */}


      {/* Div Card End */}

      {/*  Points  */}
      <div className="mt-2 text-xl font-bold">404 Honor Points</div>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">
              #
            </TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Invited Friends</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">
              <Image src="/icon/best-icon.jpg" height={36} width={36}
                     alt="pop" />
            </TableCell>
            <TableCell
              className="font-extralight text-center">{userData?.refCount ? parseInt(userData.refCount) * 2 : '-'}</TableCell>
            <TableCell className="text-center">
              {userData ? userData.refCount : '-'}
            </TableCell>
            <TableCell className="text-center">
              <Button
                variant={'outline'}
                disabled={true}
              >
                Details
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {/*  Points End */}

      {/* card */}
      <Card className={''}>
        <CardHeader>
          <CardTitle>Rules</CardTitle>
          <CardDescription>How to earn 404 honor points?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1 rounded-sm">
          <div>
            {rules.map((rule, index) => (
              <div
                key={index}
                className="mb-3 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-md bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {rule.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCopy}>
            <ClipboardCopyIcon className="mr-2 h-4 w-4" /> Copy Your Referral Link
          </Button>
        </CardFooter>
      </Card>
      {/* card end */}


      <div className="mt-20 mb-20 text-gray-600 text-center">&nbsp;</div>
      <div className="mt-20  text-gray-600 text-center">
        <Popover>
          <PopoverTrigger className="text-gray-400">A friend in need is a friend indeed.</PopoverTrigger>
          <PopoverContent
            className={'w-[300px] break-all'}>
            <div className={'break-all'}></div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex w-full flex-col pb-10">&nbsp;</div>
    </div>
  );
};

