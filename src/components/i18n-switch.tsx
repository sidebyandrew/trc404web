'use client';

import { EarthIcon } from '@/components/icons';
import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useIsSSR } from '@react-aria/ssr';
import { useEffect, useState } from 'react';

export default function I18NSwitch() {
  let isSSR = useIsSSR();
  const [currentDate, setCurrentDate] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  let offset = -new Date().getTimezoneOffset() / 60;
  let utc = offset > 0 ? '+' + offset : '' + offset;

  useEffect(() => {
    let intervalId = setInterval(
      () => setCurrentDate(new Date().toLocaleString()),
      1000
    );
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Button variant={'light'} isIconOnly aria-label="i8n" onPress={onOpen}>
        <EarthIcon size={22} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Preferred Language and Timezone
              </ModalHeader>
              <ModalBody>
                <p>
                  <div> Current Time: {currentDate}</div>
                  {!isSSR && <div>Timezone: {timeZone}</div>}
                  {!isSSR && <div> UTC: {utc}</div>}
                </p>
                <Button variant="solid" aria-label="i8n" onPress={onOpen}>
                  切换为中文
                </Button>
              </ModalBody>
              <ModalFooter>
                <Button variant={'flat'} onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
