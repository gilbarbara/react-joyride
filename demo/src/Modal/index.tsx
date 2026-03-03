import { useEffect } from 'react';
import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';
import Modal from 'react-modal';
import { useMount, usePrevious, useSetState } from '@gilbarbara/hooks';
import { Button, Input } from '@heroui/react';
// @ts-ignore
import a11yChecker from 'a11y-checker';

import Container from '~/components/Container';

import { logGroup } from '../modules/helpers';

interface State {
  modalIsOpen: boolean;
  run: boolean;
  steps: Step[];
}

export default function ModalDemo() {
  const [{ modalIsOpen, run, steps }, setState] = useSetState<State>({
    modalIsOpen: false,
    run: false,
    steps: [
      {
        content: "Here's an input inside a modal that can be used through the spotlight",
        placement: 'bottom',
        target: '.modal-items > div:nth-child(1)',
        disableFocusTrap: true,
      },
      {
        content: 'Tabs or spaces? 🤔',
        placement: 'bottom',
        target: '.modal-items > div:nth-child(2)',
      },
      {
        content: "A button! That's rare on the web",
        placement: 'bottom',
        target: '.modal-items > div:nth-child(3)',
      },
      {
        content: "Sometimes I wonder what's inside my mind",
        placement: 'bottom',
        target: '.modal-items > div:nth-child(4)',
      },
      {
        content: 'Modal, Portal, Quintal!',
        placement: 'bottom',
        target: '.modal-items > div:nth-child(5)',
      },
    ],
  });
  const previousModalIsOpen = usePrevious(modalIsOpen);

  useMount(() => {
    a11yChecker();
  });

  useEffect(() => {
    if (!previousModalIsOpen && modalIsOpen) {
      setState({
        run: true,
      });
    }
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState({ run: false });
    }

    logGroup(type, data);
  };

  const openModal = () => {
    setState({
      modalIsOpen: true,
    });
  };

  const closeModal = () => {
    setState({
      modalIsOpen: false,
      run: false,
    });
  };

  const afterOpenModal = () => {
    setState({
      run: true,
    });
  };

  const customStyles = {
    content: {
      top: 100,
      margin: '0 auto',
      maxHeight: '70%',
      maxWidth: 1280,
      textAlign: 'center' as const,
    },
  };

  return (
    <div className="bg-green-200 flex flex-col flex-1">
      <Container className="py-8 items-center justify-center">
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          run={run}
          stepOptions={{
            showSkipButton: true,
          }}
          steps={steps}
          styles={{
            options: {
              arrowColor: '#bbf7d0',
              backgroundColor: '#bbf7d0',
              primaryColor: '#000',
              textColor: '#000',
            },
          }}
        />
        <h1 className="text-4xl font-bold mb-2">It works with modals</h1>
        <h2 className="text-2xl font-bold mb-2">
          (using{' '}
          <a
            aria-label="Open react-modal in a new window"
            className="text-green-600 underline"
            href="https://github.com/reactjs/react-modal"
            rel="noopener noreferrer"
            target="_blank"
          >
            react-modal
          </a>
          )
        </h2>
        <Button color="success" onPress={openModal}>
          Open Modal
        </Button>
        <Modal
          ariaHideApp={false}
          contentLabel="Example Modal"
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <h2 className="text-2xl font-bold mb-2">A react-modal example</h2>
          <p>I am a modal</p>
          <div className="modal-items flex justify-center gap-4 flex-wrap mt-4">
            <div>
              <Input name="test" type="text" />
            </div>
            <div>
              <Button color="success" tabIndex={0}>
                tab navigation
              </Button>
            </div>
            <div>
              <Button color="success" tabIndex={0}>
                stays
              </Button>
            </div>
            <div>
              <Button color="success" tabIndex={0}>
                inside
              </Button>
            </div>
            <div>
              <Button color="success" tabIndex={0}>
                the modal
              </Button>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  );
}
