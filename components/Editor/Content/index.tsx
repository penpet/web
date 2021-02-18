import { useRef, useState, useCallback, useEffect } from 'react'
import ShareDB, { Doc } from 'sharedb/lib/client'
import richText from 'rich-text'
import Quill, { TextChangeHandler } from 'quill'
import UploadImage from 'quill-upload-image'
import katex from 'katex'

import upload from 'lib/upload'
import { SOCKET_ORIGIN } from 'lib/constants'
import handleError from 'lib/handleError'
import Spinner from 'components/Spinner'
import UploadModal from 'components/Modal/Upload'

import styles from './index.module.scss'

ShareDB.types.register(richText.type)
Quill.register('modules/uploadImage', UploadImage)

export interface EditorContentProps {
	id: string
}

const EditorContent = ({ id }: EditorContentProps) => {
	const [isLoading, setIsLoading] = useState(true)
	const [isUploading, setIsUploading] = useState(false)

	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	const uploadImage = useCallback(
		async (file: File) => {
			try {
				setIsUploading(true)
				return await upload(file)
			} finally {
				setIsUploading(false)
			}
		},
		[setIsUploading]
	)

	useEffect(() => {
		if (!('katex' in window))
			((window as unknown) as Record<string, unknown>).katex = katex

		const toolbar = toolbarRef.current
		const content = contentRef.current

		if (!(id && toolbar && content)) return

		setIsLoading(true)

		const socket = new WebSocket(`${SOCKET_ORIGIN}/pens/${id}`)
		const connection = new ShareDB.Connection(socket as never)

		let doc: Doc | null = connection.get('pens', id)
		let quill: Quill | null = null

		const onTextChange: TextChangeHandler = (delta, _oldDelta, source) => {
			if (!doc || source !== 'user') return
			doc.submitOp(delta, { source: quill })
		}

		const onOperation = (operation: unknown, source: unknown) => {
			if (!quill || source === quill) return
			quill.updateContents(operation as never)
		}

		doc.subscribe(error => {
			if (error) return handleError(error)
			if (!doc) return

			quill = new Quill(content, {
				theme: 'snow',
				placeholder: 'Write anything!',
				modules: {
					toolbar,
					uploadImage: {
						upload: uploadImage,
						onError: handleError
					}
				}
			})

			quill.setContents(doc.data)

			quill.on('text-change', onTextChange)
			doc.on('op', onOperation)

			setIsLoading(false)
		})

		return () => {
			connection.close()

			doc?.off('op', onOperation)
			quill?.off('text-change', onTextChange)

			doc = quill = null
		}
	}, [id, toolbarRef, contentRef, uploadImage, setIsLoading])

	return (
		<div key={id} className={styles.root} aria-busy={isLoading}>
			<div className={styles.toolbar} ref={toolbarRef}>
				<span className="ql-formats">
					<select className="ql-size" />
				</span>
				<span className="ql-formats">
					<button className="ql-bold" />
					<button className="ql-italic" />
					<button className="ql-underline" />
					<button className="ql-strike" />
				</span>
				<span className="ql-formats">
					<select className="ql-color" />
					<select className="ql-background" />
				</span>
				<span className="ql-formats">
					<button className="ql-script" value="sub" />
					<button className="ql-script" value="super" />
				</span>
				<span className="ql-formats">
					<button className="ql-header" value="1" />
					<button className="ql-header" value="2" />
					<button className="ql-blockquote" />
					<button className="ql-code" />
					<button className="ql-code-block" />
				</span>
				<span className="ql-formats">
					<button className="ql-list" value="ordered" />
					<button className="ql-list" value="bullet" />
					<button className="ql-indent" value="-1" />
					<button className="ql-indent" value="+1" />
				</span>
				<span className="ql-formats">
					<button className="ql-direction" value="rtl" />
					<select className="ql-align" />
				</span>
				<span className="ql-formats">
					<button className="ql-link" />
					<button className="ql-image" />
					<button className="ql-video" />
					<button className="ql-formula" />
				</span>
				<span className="ql-formats">
					<button className="ql-clean" />
				</span>
			</div>
			<div className={styles.content} ref={contentRef} />
			{isLoading && <Spinner className={styles.spinner} />}
			<UploadModal isShowing={isUploading} setIsShowing={setIsUploading} />
		</div>
	)
}

export default EditorContent
