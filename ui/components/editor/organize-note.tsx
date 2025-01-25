import { Note } from "@/queries/services/note";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Button } from "../ui/button";
import { HashtagIcon } from "@heroicons/react/16/solid";

export const OrganizeNote = ({ note } : { note: Note }) => {
  // the idea is it'll be an organize button on top of the note editor
  // when clicked, it'll open a dropdown with the list of collections
  // the user can select a collection and the note will be added to that collection
  // if the note is already in the collection, it'll be removed from the collection
  return (
    <Popover>
      <PopoverButton as={Button} outline>
        <HashtagIcon />
        organize
      </PopoverButton>
      <PopoverPanel>
        
      </PopoverPanel>
    </Popover>
  )
}