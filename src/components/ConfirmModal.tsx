import React from 'react';
import {createGlobalStyles} from '../utils/styles';
import Modal from 'react-native-modal';
import {Button, Text, useTheme} from 'react-native-paper';
import {View} from 'react-native';
import PageTitle from './PageTitle';
import CustomActivityIndicator from './CustomActivityIndicator';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  contents: string;
  confirmString: string;
  cancelString: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmStyle: string;
};
const ConfirmModal = ({
  visible,
  title,
  contents,
  confirmString,
  cancelString,
  loading,
  onConfirm,
  onCancel,
  confirmStyle,
}: ConfirmModalProps) => {
  const theme = useTheme();
  const globalStyles = createGlobalStyles(theme);

  return (
    <Modal isVisible={visible} style={globalStyles.modalContainerBack}>
      <View style={globalStyles.modalContainer}>
        <View style={{alignItems: 'center', gap: 20}}>
          <Text style={globalStyles.errorText} variant="titleLarge">
            {title}
          </Text>
          <PageTitle>{contents}</PageTitle>
        </View>
        <View style={globalStyles.modalButtonGroup}>
          <Button
            mode="contained"
            style={
              confirmStyle == 'default'
                ? globalStyles.defaultModalButton
                : globalStyles.dangerModalButton
            }
            onPress={onConfirm}>
            {confirmString}
          </Button>
          <Button
            onPress={onCancel}
            mode="contained"
            style={globalStyles.defaultModalButton}>
            {cancelString}
          </Button>
        </View>
        <CustomActivityIndicator loading={loading} />
      </View>
    </Modal>
  );
};

export default ConfirmModal;
