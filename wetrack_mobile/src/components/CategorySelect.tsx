import React, { useState } from 'react';
import { SelectList } from 'react-native-dropdown-select-list'

const CategorySelect = () => {
    const [selected, setSelected] = React.useState("");

    const data = [
        {key:'1', value:'Transportation'},
        {key:'2', value:'Food & Drink'},
        {key:'3', value:'Entertainment'},
        {key:'4', value:'Bills & Utilities'},
        {key:'5', value:'Retail Shopping'},
        {key:'6', value:'Groceries'},
    ]

    return(
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
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
        />
    )
};


export default CategorySelect;