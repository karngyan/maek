'use client'

import { Field, FieldGroup, Label } from '@/components/ui/fieldset'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useAuthInfo } from '@/queries/hooks/auth/use-auth-info'
import { useUpdateWorkspace } from '@/queries/hooks/auth/use-update-workspace'
import { useDebounceCallback } from '@react-hook/debounce'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function WorkspaceSettingsPage({
  params,
}: {
  params: { wid: string }
}) {
  const { isPending, isFetching, data: authInfoResponse, error } = useAuthInfo()
  const { mutate: updateWorkspace } = useUpdateWorkspace()
  const workspaceId = +params.wid

  const currentWorkspace = useMemo(() => {
    if (authInfoResponse) {
      return authInfoResponse.workspaces.find(
        (workspace) => workspace.id === workspaceId
      )
    }
    return null
  }, [authInfoResponse, workspaceId])

  const [workspaceLocalName, setWorkspaceLocalName] = useState(currentWorkspace?.name)
  const [worksapceLocalDescription, setWorkspaceLocalDescription] = useState(currentWorkspace?.description)

  const debouncedUpdate = useDebounceCallback((name: string, description) => {
    updateWorkspace(
      { name: name.trim(), description: description.trim(), wid: workspaceId },
      {
        onSuccess: () => {
          toast.success('your workspace has been updated')
        },
      }
    )
  }, 600)

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setWorkspaceLocalName(name)
    debouncedUpdate(name, worksapceLocalDescription)
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value
    setWorkspaceLocalDescription(description)
    debouncedUpdate(workspaceLocalName ?? '', description)
  }

  if (isPending || isFetching) {
    return (
      <div className='py-80 flex items-center justify-center'>
        <Spinner className='dark:text-zinc-800 h-12' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-zinc-300 py-80 px-6'>error: {error.message}</div>
    )
  }

  return (
    <div className='max-w-lg mx-auto py-16 px-4'>
      <FieldGroup>
        <Field>
          <Label>workspace name</Label>
          <Input name='workspace_name' value={workspaceLocalName} onChange={onNameChange} />
        </Field>
        <Field>
          <Label>workspace description</Label>
          <Textarea
            name='workspace_description'
            value={worksapceLocalDescription}
            onChange={onDescriptionChange}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
