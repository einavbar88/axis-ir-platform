import React from 'react';
import Editor, {
  BtnBold,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  Toolbar,
} from 'react-simple-wysiwyg';

type Props = {
  onChange: (e: any) => void;
  value?: string;
  name: string;
  extraClassName?: string;
};

export const RichTextEditor: React.FC<Props> = ({
  onChange,
  value,
  name,
  extraClassName = '',
}) => {
  return (
    <Editor
      className={`bg-white ${extraClassName}`}
      value={value}
      name={name}
      onChange={onChange}
    >
      <Toolbar>
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnStrikeThrough />
        <BtnLink />
        <BtnNumberedList />
        <BtnUndo />
        <BtnStyles />
      </Toolbar>
    </Editor>
  );
};
