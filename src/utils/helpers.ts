export function truncateFileName(fileName: string, maxLength = 30): string {
  // Split the file name into the base name and extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const name =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';

  // If the file name is already within the allowed length, return it
  if (fileName.length <= maxLength) {
    return fileName;
  }

  // Calculate the length available for the base name after considering the extension
  const truncateLength = maxLength - extension.length;

  // Ensure the truncated name is not negative and return the truncated file name
  const truncatedName = name.substring(0, Math.max(0, truncateLength));
  return truncatedName + extension;
}

export const getMimeType = (fileName: string) => {
  const extension = fileName.split('.').pop() as string;
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    rtf: 'application/rtf',
  };
  return mimeTypes[extension] || 'application/octet-stream';
};
