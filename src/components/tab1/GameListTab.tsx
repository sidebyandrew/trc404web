import GameList from '@/components/tab1/GameList';
import { global_challenges, global_games } from '@/config/popcoin-data';
import { Tab, Tabs } from '@nextui-org/react';

export default function GameListTab() {
  return (
    <div className="flex w-full flex-col pb-20">
      <Tabs variant={'underlined'} aria-label="Options">
        <Tab key="challenges" title="Challenges">
          <div>
            <GameList type={'CHALLENGES'} games={global_games} />
          </div>
        </Tab>
        <Tab key="battles" title="PvP Battles">
          <div>
            <GameList type={'BATTLES'} games={global_challenges} />
          </div>
        </Tab>
      </Tabs>
      <div className="text-center text-gray-600">endless gaming...</div>
    </div>
  );
}
