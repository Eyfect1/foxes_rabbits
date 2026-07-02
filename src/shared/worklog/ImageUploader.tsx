interface ImageUploaderProps {
  onSelect: (files: FileList) => void
}

export function ImageUploader({ onSelect }: ImageUploaderProps) {
  return (
    <div className="field">
      <label htmlFor="worklog-image-upload">Скриншоты (до 5 МБ каждый)</label>
      <input
        id="worklog-image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            onSelect(event.target.files)
            event.target.value = ''
          }
        }}
      />
    </div>
  )
}
