import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { getCountylistService } from "../Services/ApiService";
import { SmileOutlined } from "@ant-design/icons";

type Props = {
  value?: number | undefined;
  width?: string;
  marginTop?: number;
  isDisabled?: boolean;
  onSelectItem: (val: any) => void;
  status?: "" | "warning" | "error" | undefined;
};

function CountryCodeDropdown({
  isDisabled = false,
  status = undefined,
  onSelectItem,
  width,
  value,
  marginTop,
}: Props) {
  const { Option } = Select;
  const [CountryCodes, setCountryCodes] = useState([]);
  const [SelectedCountry, setSelectedCountry] = useState(null);
  const getCountryCodes = () => {
    getCountylistService().then((res) => {
      const convertMobileCodes = res.data.country_list.map((ele) => {
        return {
          ...ele,

          id: ele.id,
          label: ele.phone_code,
          value: ele.id,
        };
      });
      setCountryCodes(convertMobileCodes);
    });
  };

  useEffect(() => {
    getCountryCodes();
  }, []);

  const getValidDisplayValue = (val) => {
    if (!val || val === "") {
      return null;
    }
    return val;
  };

  return (
    <div style={{ width, marginTop }}>
      <Select
        style={{ width: "100%" }}
        placeholder="Code"
        className="textBox"
        dropdownMatchSelectWidth={false}
        defaultValue={getValidDisplayValue(SelectedCountry || value)}
        disabled={isDisabled}
        status={status}
        showSearch
        value={getValidDisplayValue(SelectedCountry || value)}
        onSelect={(val, value) => {
          onSelectItem(value);
          //@ts-ignore
          setSelectedCountry(value?.label);
        }}
      >
        {CountryCodes.map(({ value, label, name, id }) => (
          <Option value={`${name} (${label})`} label={label} key={id}>
            {`${name} (${label})`}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default CountryCodeDropdown;
