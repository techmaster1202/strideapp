import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {truncateFileName} from '../utils/helpers';
import {IconButton, useTheme} from 'react-native-paper';
import {baseIP} from '../utils/axiosInstance';

interface IProps {
  label: string;
  existingFiles?: Record<string, any>[];
  preview?: boolean;
  deleteFile?: (id: string) => Promise<void>;
  uploadFile: (file: Record<string, any>) => Promise<void>;
}
const FileUploader = ({
  label,
  existingFiles = [],
  preview = false,
  deleteFile,
  uploadFile,
}: IProps) => {
  const theme = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>[]>([]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const newFile = {
        id: `local_${Date.now().toString()}`, // Unique ID for tracking
        file_name: result.name,
        url: result.uri,
        file_size: result.size,
      };
      await uploadFile(newFile);
      //   setUploadedFiles([...uploadedFiles, newFile]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error(err);
      }
    }
  };

  const removeFile = (fileId: string) => {
    if (typeof fileId === 'string' && fileId.includes('local')) {
      setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
    } else {
      deleteFile?.(fileId);
    }
  };

  const renderFileItem = (item: Record<string, any>) => {
    const imageUrl = item?.url?.includes('localhost')
      ? item.url.replace('localhost', baseIP)
      : item?.url?.startsWith('uploads')
      ? `http://${baseIP}:8000/storage/${item.url}`
      : item.url;
    return (
      <View style={styles.fileItem}>
        {preview ? (
          <Image
            source={{uri: imageUrl}}
            style={[styles.filePreview, {objectFit: 'cover'}]}
          />
        ) : (
          <Text style={styles.fileName}>
            {truncateFileName(item?.file_name ?? item?.name)}
          </Text>
        )}
        <Text style={styles.fileSize}>
          {(Number(item?.file_size ?? item?.size) / 1024).toFixed(2)} KB
        </Text>

        <IconButton
          onPress={() => removeFile(item.id)}
          icon="delete"
          mode="contained"
          size={20}
          iconColor={theme.colors.error}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
        <Text style={styles.uploadText}>
          {uploadedFiles.length > 0
            ? 'Add Another File'
            : 'Drag & Drop your files or Browse'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={[...uploadedFiles, ...existingFiles]}
        keyExtractor={(item, index) => item?.id || index}
        renderItem={({item}) => renderFileItem(item)}
        style={styles.fileList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadText: {
    color: '#888',
  },
  fileList: {
    marginTop: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
  },
  fileSize: {
    color: '#888',
    marginLeft: 8,
  },
  removeButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  filePreview: {
    width: 60,
    height: 30,
    borderRadius: 4,
  },
});

export default FileUploader;
