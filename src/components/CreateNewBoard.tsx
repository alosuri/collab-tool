import { useAuth } from '@/context/AuthContext'
import supabase from '@/lib/supabase'
import { Dialog, Button, Portal, Stack, Field, Input } from '@chakra-ui/react'
import { PlusIcon } from 'lucide-react'
import { useRef } from 'react'

const CreateNewBoard = ({onCreated}: {onCreated: () => void}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);  // Ref for the board name input
  const { session } = useAuth();

  const create = async () => {
    // Get the board name from the input field using the correct ref
    const boardName = nameRef.current?.value;

    if (!boardName) {
      console.error('Board name is required!');
      return; // Prevent creation if the name is empty
    }

    // Perform the insert operation
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: boardName,         // Use the correct board name
        canvas_state: {},        // Initialize with an empty JSON object
        user_id: session?.user.id // Set the authenticated user's ID
      });

    // Check for errors
    if (error) {
      console.error('Error creating project:', error);
    } else {
      console.log('Project created successfully:', data);
      onCreated();
    }
  };

  return (
    <Dialog.Root placement="center">
      <Dialog.Trigger asChild>
        <Button variant="outline"><PlusIcon />  New Board</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create New Board</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Board Name</Field.Label>
                  <Input placeholder="Board Name" ref={nameRef} />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button onClick={create}>Create</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateNewBoard;
