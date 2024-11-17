import React from 'react';
import { SelectList } from 'react-native-dropdown-select-list'

const CategorySelect = ({ selectedCategory, onCategoryChange }) => {
    const data = [
        {key:'1', value:'Transportation'},
        {key:'2', value:'Food & Drink'},
        {key:'3', value:'Entertainment'},
        {key:'4', value:'Bills & Utilities'},
        {key:'5', value:'Retail Shopping'},
        {key:'6', value:'Groceries'},
    ];

    // Find the initial selected value based on the selectedCategory prop
    const initialValue = data.find(item => item.key === selectedCategory)?.value || '';

    return (
        <SelectList
            boxStyles={{
                borderWidth: 0,
                paddingHorizontal: 0,
                paddingVertical: 3,
            }}
            inputStyles={{
                fontSize: 20,
                color: '#000000',
                paddingRight: 5,
            }}
            dropdownTextStyles={{
                fontSize: 20,
                color: '#000000',
            }}
            setSelected={(val) => {
                // Find the key corresponding to the selected value
                const selectedItem = data.find(item => item.value === val);
                if (selectedItem) {
                    onCategoryChange(selectedItem.key);
                }
            }}
            data={data}
            save="value"
            defaultOption={{ key: selectedCategory, value: initialValue }}
            search={false}
        />
    );
};

export default CategorySelect;