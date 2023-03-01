import React, { useEffect, useRef } from 'react'

function Select(props: any) {

    const { options, type, register } = props
    const selectRef = useRef()

    const [show, setShow] = React.useState(false)
    const [inputValue, setInputValue] = React.useState('')
    const [autoComplete, setAutoComplete] = React.useState('')
    const [filteredOptions, setFilteredOptions] = React.useState(options)



    const renderOptions = () => {
        return options?.map((o: { type: string, color: string }, i: number) => {
            return (
                <div
                    style={{ backgroundColor: o.color }}
                    onClick={() => setInputValue(o.type)}
                    className='option'
                > {o.type[0].toUpperCase() + o.type.slice(1)}
                </div >
            )
        })
    }


    const handleSelectClick = () => {
        setShow(!show)
    }

    const handleSearchInputChange = (e: any) => {
        if (e.target.value.length > 0) {
            setShow(true)
        }
        let inputLength = e.target.value.length
        let match = options.find((o: any) => {
            return o.type.slice(0, inputLength) === e.target.value.slice(0, inputLength)

        })
        setInputValue(e.target.value.slice(0, inputLength))
        if (match && match.type.length) {
            setAutoComplete(match.type.slice(inputLength, match.type.length))
        }

        if (e.target.value.length === 0) {
            setAutoComplete('')
        }
    }

    return (
        <div className='select-ctn' onClick={handleSelectClick}
        // ref={selectRef}
        >
            <input {...register('type')}
                type='text'
                className='task_form-input'
                onChange={handleSearchInputChange}
                autoComplete='off'
                value={inputValue}
            />
            <span className='autocomplete'>
                <div className='invisible'>{inputValue}</div>
                <div>{autoComplete}</div>
            </span>
            {show &&
                <div>
                    {renderOptions()}
                </div>
            }
        </div>
    )
}

export default Select