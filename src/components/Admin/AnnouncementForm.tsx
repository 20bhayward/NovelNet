import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

interface AnnouncementFormProps {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState(initialValues || { title: '', content: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4}>
        <FormLabel color="white">Title</FormLabel>
        <Input
          name="title"
          value={values.title}
          onChange={handleInputChange}
          bg="subbackground"
          color="white"
          borderColor="border"
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel color="white">Content</FormLabel>
        <Textarea
          name="content"
          value={values.content}
          onChange={handleInputChange}
          bg="subbackground"
          color="white"
          borderColor="border"
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" mr={4}>
        {initialValues ? 'Update' : 'Create'}
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </form>
  );
};

export default AnnouncementForm;