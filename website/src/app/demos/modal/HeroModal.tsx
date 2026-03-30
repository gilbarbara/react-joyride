import {
  Button,
  cn,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@heroui/react';

interface HeroModalProps {
  activeModal: string;
  activeSection: 'profile' | 'notifications';
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onSectionChange: (section: 'profile' | 'notifications') => void;
}

export default function HeroModal(props: HeroModalProps) {
  const { activeModal, activeSection, onOpen, onOpenChange, onSectionChange } = props;

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Open HeroUI Modal
      </Button>
      <Modal
        classNames={{
          backdrop: '!z-[80]',
          wrapper: '!z-[90]',
        }}
        isOpen={activeModal === 'heroui'}
        onOpenChange={onOpenChange}
        size="3xl"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Settings</ModalHeader>
              <ModalBody>
                <div className="flex gap-6 min-h-100">
                  <div className="settings-sidebar w-48 shrink-0 border-r border-default pr-4">
                    <nav className="flex flex-col gap-1">
                      <button
                        className={cn(
                          'text-left px-3 py-2 rounded-lg transition-colors',
                          activeSection === 'profile'
                            ? 'bg-primary-100 text-primary font-semibold'
                            : 'hover:bg-default-100',
                        )}
                        onClick={() => onSectionChange('profile')}
                        type="button"
                      >
                        Profile
                      </button>
                      <button
                        className={cn(
                          'text-left px-3 py-2 rounded-lg transition-colors',
                          activeSection === 'notifications'
                            ? 'bg-primary-100 text-primary font-semibold'
                            : 'hover:bg-default-100',
                        )}
                        onClick={() => onSectionChange('notifications')}
                        type="button"
                      >
                        Notifications
                      </button>
                    </nav>
                  </div>

                  <div className="flex-1">
                    {activeSection === 'profile' ? (
                      <div className="flex flex-col gap-5">
                        <div className="settings-display-name">
                          <Input
                            label="Display Name"
                            labelPlacement="outside-top"
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Username</p>
                            <p className="text-sm text-primary">@janedoe</p>
                          </div>
                          <span className="text-sm text-default-500">Cannot be changed</span>
                        </div>
                        <div className="settings-language">
                          <Select
                            label="Language"
                            labelPlacement="outside-top"
                            placeholder="Select language"
                          >
                            <SelectItem key="en">English</SelectItem>
                            <SelectItem key="es">Spanish</SelectItem>
                            <SelectItem key="fr">French</SelectItem>
                            <SelectItem key="de">German</SelectItem>
                          </Select>
                        </div>
                        <div className="settings-private-profile flex items-center justify-between">
                          <span className="text-sm">Private Profile</span>
                          <Switch size="sm" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                        <div className="settings-mobile-push flex items-center justify-between">
                          <span className="text-sm">Mobile push notifications</span>
                          <Switch defaultSelected size="sm" />
                        </div>
                        <Divider />
                        <div className="settings-email flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Email notifications</span>
                            <Switch defaultSelected size="sm" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Communication emails</span>
                            <Switch size="sm" />
                          </div>
                        </div>
                        <Divider />
                        <div className="settings-marketing flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Marketing emails</span>
                            <Switch size="sm" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Social notifications</span>
                            <Switch defaultSelected size="sm" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose} variant="light">
                  Cancel
                </Button>
                <Button color="primary">Save</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
