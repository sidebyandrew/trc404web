'use client';

import { Button } from '@nextui-org/button';
import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(100);

  return (
    <Button variant={'ghost'} radius="full" onPress={() => setCount(count + 1)}>
      Event Count {count}
    </Button>
  );
};
