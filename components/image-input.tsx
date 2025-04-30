import { ChangeEvent, useState } from "react";
import { Label } from "./ui/label";

export const ImageInput = ({
  previewValue,
  onChange,
  id,
  ...props
}: {
  previewValue?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
} & {
  [key: string]: any;
}) => {
  const [preview, setPreview] = useState<string | null>(previewValue || null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
    onChange(e);
  };

  return (
    <div className="relative w-full h-64 border-2 border-dashed rounded-lg flex items-center cursor-pointer overflow-hidden group">
      <div className="w-64 h-full flex flex-col items-center border rounded-lg text-gray-500 mr-auto">
        {!preview && <span className="m-auto">изображение</span>}
        {preview && <img className="m-auto" src={preview} alt="Preview" />}
      </div>
      <input id={id} {...props} hidden onChange={handleChange} />
      <Label
        className="mx-auto bg-primary text-white p-3 rounded-md"
        htmlFor={id}
      >
        Загрузить изображение
      </Label>
    </div>
  );
};

export default ImageInput;
