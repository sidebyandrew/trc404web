import BadgeInfo from '@/components/icon/badgeInfo';
import BadgeVerified from '@/components/icon/badgeVerified';
import IconCalendar from '@/components/icon/calendar';
import IconMap from '@/components/icon/map';
import { conferencesList } from '@/utils/data';
import Image from 'next/image';
import Link from 'next/link';

async function getConferencesData(url: string) {
  const res = await fetch(url);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function CardFlex() {
  let listItems = conferencesList.map((conference: any) => (
    <div key={conference.id} className="p-2 lg:w-1/2">
      <div className="rounded-lg bg-gray-800 bg-opacity-40 p-3">
        <Link href={conference.origin}>
          <div>
            <Image
              className="h-46 mb-2 w-full rounded object-fill"
              src={conference.cover}
              alt="content"
              width={256}
              height={256}
            />
          </div>

          <h2 className="title-font font-media mb-4 text-lg tracking-tight text-white dark:text-white md:text-xl">
            {conference.title}
          </h2>
          <div className="title-font flex flex-row text-xs font-medium tracking-widest text-blue-400">
            <IconMap addClass=" text-blue-800 dark:text-blue-400 mr-1 " />
            {conference.venue}
          </div>
          <div className="flex flex-row text-base leading-relaxed">
            <IconCalendar addClass=" text-gray-400 dark:text-gray-500 mt-1 " />
            {conference.start_time} - {conference.end_time}
          </div>

          <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />

          <div className="flex flex-row">
            <div className="flex basis-2/3 flex-row" id="this is 1/2 host info">
              <div>
                <Image
                  className="m-1 h-6 w-6 rounded-full"
                  src={conference.host.logo}
                  alt="logo"
                  width={36}
                  height={36}
                />
              </div>

              <div className="g-5 title-font ml-1 mt-2 h-6 text-justify text-xs font-medium tracking-widest text-gray-400">
                {conference.host.name}
              </div>

              {conference.host.verified && <BadgeVerified />}
              {!conference.host.verified && <BadgeInfo />}
            </div>
            <div className="g-5 ml-1 mt-2 flex h-6 basis-1/3 flex-row place-content-end gap-2">
              <div className="title-font text-justify text-xs font-medium tracking-widest text-gray-400">
                Side Events
              </div>
              <div className="title-font text-justify text-xs font-medium tracking-widest text-gray-400">
                {conference.side_events_count}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  ));

  return (
    <section className="body-font bg-gray-900 text-gray-400">
      <div className="container mx-auto px-2 py-2">
        <div className="-m-4 flex flex-wrap">{listItems}</div>
      </div>
    </section>
  );
}
