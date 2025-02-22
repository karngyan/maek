import { Block, BlockNoteEditor, blockToNode } from '@blocknote/core'
import { prosemirrorToYDoc } from 'y-prosemirror'

const editor = BlockNoteEditor.create({
  _headless: true,
})

/**
 * This can be used when importing existing content to Y.Doc for the first time,
 * note that this should not be used to rehydrate a Y.Doc from a database once
 * collaboration has begun as all history will be lost
 *
 * @param blocks
 */
export function blocksToYDoc(blocks: Block[], xmlFragment = 'blocknote') {
  return prosemirrorToYDoc(_blocksToProsemirrorNode(blocks), xmlFragment)
}

/**
 * Turn BlockNote JSON to Prosemirror node / state
 * @param blocks BlockNote blocks
 * @returns Prosemirror root node
 */
function _blocksToProsemirrorNode(blocks: Block[]) {
  const pmNodes = blocks.map((b) =>
    blockToNode(b, editor.pmSchema, editor.schema.styleSchema)
  )

  const doc = editor.pmSchema.topNodeType.create(
    null,
    editor.pmSchema.nodes['blockGroup'].create(null, pmNodes)
  )
  return doc
}
