export {};

declare global {
    // const undefined: undefined;

    const NaN: number;

    const Infinity: number;

    /**
     * Displays expressions, or writes to log files, while debugging.
     */
    function trace(...argumentsList: any[]): void;

    /**
     * Decodes an encoded URI into a string.
     */
    function decodeURI(uri: string): string;

    /**
     * Decodes an encoded URI component into a string.
     */
    function decodeURIComponent(uri: string): string;

    /**
     * Encodes a string into a valid URI (Uniform Resource Identifier).
     */
    function encodeURI(uri: string): string;

    /**
     * Encodes a string into a valid URI component.
     */
    function encodeURIComponent(uri: string): string;

    /**
     * Returns `true` if the value is a finite number, or `false` if the value is `Infinity` or `-Infinity`.
     */
    function isFinite(num: number): boolean;

    function isNaN(num: number): boolean;

    function isXMLName(str: string): boolean;

    function parseFloat(str: string): number;

    function parseInt(str: string, radix?: number): number;

    /**
     * The Object class is at the root of the ActionScript runtime class hierarchy.
     */
    class Object {
        /**
         * A reference to the class object or constructor function for a given object instance.
         */
        ['constructor']: object;

        /**
         * Indicates whether an object has a specified property defined.
         */
        hasOwnProperty(name: string): boolean;

        /**
         * Returns the string representation of the specified object.
         */
        toString(): string;

        /**
         * Returns the string representation of this object, formatted according to locale-specific conventions.
         */
        toLocaleString(): string;

        /**
         * Returns the primitive value of the specified object.
         */
        valueOf(): any;
    }

    class Array<T> {
        length: number;

        constructor(numElements?: number);

        concat(...argumentsList: T[]): T[];

        every(callback: (item: T, index: number, array: T[]) => boolean): boolean;

        filter(callback: (item: T, index: number, array: T[]) => boolean): T[];

        forEach(callback: (item: T, index: number, array: T[]) => void): void;

        indexOf(searchElement: T, fromIndex?: number): number;

        insertAt(index: number, element: T): void;

        join(sep: any): string;

        lastIndexOf(searchElement: T, fromIndex?: number): number;

        map(callback: (item: T, index: number, array: T[]) => T): T[];

        pop(): T | undefined;

        push(...argumentsList: T[]): number;

        removeAt(index: number): T | undefined;

        /**
         * Reverses the array in place.
         */
        reverse(): T[];

        /**
         * Removes the first element from an array and returns that element.
         */
        shift(): T | undefined;

        slice(startIndex?: number, endIndex?: number): T[];

        some(callback: (item: T, index: number, array: T[]) => boolean): boolean;

        static readonly CASEINSENSITIVE: 1;
        static readonly DESCENDING: 2;
        static readonly UNIQUESORT: 4;
        static readonly RETURNINDEXEDARRAY: 8;
        static readonly NUMERIC: 16;

        /**
         * Sorts the elements in an array. This method sorts according to Unicode values.
         *
         * By default, `Array.sort()` works in the following way:
         * - Sorting is case-sensitive (_Z_ precedes _a_).
         * - Sorting is ascending (_a_ precedes _b_).
         * - The array is modified to reflect the sort order;
         * multiple elements that have identical sort fields are placed
         * consecutively in the sorted array in no particular order.
         * - All elements, regardless of data type, are sorted as if they were strings,
         * so 100 precedes 99, because "1" is a lower string value than "9".
         *
         * To sort an array by using settings that deviate from the default settings,
         * you can either use one of the sorting options described in
         * `sortOptions` or create your own custom function to do the sorting.
         * 
         * @param compareFunction Possible returns:
         * - A negative return value specifies that `a` appears before `b` in the sorted sequence.
         * - A return value of 0 specifies that `a` and `b` have the same sort order.
         * - A positive return value specifies that `a` appears after `b` in the sorted sequence.
         * @param sortOptions Flags combining any of:
         * - `Array.CASEINSENSITIVE` or 1
         * - `Array.DESCENDING` or 2
         * - `Array.UNIQUESORT` or 4
         * - `Array.RETURNINDEXEDARRAY` or 8
         * - `Array.NUMERIC` or 16
         * 
         * @return The return value depends on whether you pass any arguments:
         * - If you specify `Array.UNIQUESORT` for the `sortOptions` argument and two or more elements being sorted have identical sort fields, the runtime returns a value of 0 and does not modify the array.
         * - If you specify `Array.RETURNINDEXEDARRAY` for the sortOptions argument, the runtime returns a sorted numeric array of the indices that reflects the results of the sort and does not modify the array.
         * - Otherwise, the runtime returns nothing and modifies the array to reflect the sort order.
         */
        sort(compareFunction?: (a: T, b: T) => number, sortOptions?: number): T[];

        /**
         * Sorts the elements in an array according to one or more fields in the array. The array should have the following characteristics:
         * - The array is an indexed array, not an associative array.
         * - Each element of the array holds an object with one or more properties.
         * - All of the objects have at least one property in common, the values of which can be used to sort the array. Such a property is called a _field_.
         * 
         * If you pass multiple `fieldName` parameters, the first field represents
         * the primary sort field, the second represents the next sort field, and so on.
         * The runtim sorts according to Unicode values.
         * If either of the elements being compared does not contain the field
         * that is specified in the `fieldName` parameter, the field is assumed to be
         * set to `undefined`, and the elements are placed consecutively in the sorted array in no particular order.
         * 
         * By default, `sortOn()` works in the following way:
         * - Sorting is case-sensitive (_Z_ precedes _a_).
         * - Sorting is ascending (_a_ precedes _b_).
         * - The array is modified to reflect the sort order;
         * multiple elements that have identical sort fields are placed consecutively in the
         * sorted array in no particular order.
         * - Numeric fields are sorted as if they were strings, so 100 precedes 99, because "1" is a lower string value than "9".
         * 
         * # Examples
         * 
         * ```ts
         * array.sortOn(someFieldName, Array.DESCENDING | Array.NUMERIC);
         * array.sortOn(['a', 'b', 'c'], [Array.DESCENDING, Array.NUMERIC, Array.CASEINSENSITIVE]);
         * ```
         * @param fieldName A string that identifies a field to be used as the sort value,
         * or an array in which the first element represents the primary sort field,
         * the second represents the secondary sort field, and so on.
         * @param options Flags or array combining any of:
         * - `Array.CASEINSENSITIVE` or 1
         * - `Array.DESCENDING` or 2
         * - `Array.UNIQUESORT` or 4
         * - `Array.RETURNINDEXEDARRAY` or 8
         * - `Array.NUMERIC` or 16
         * @return The return value depends on whether you pass any parameters:
         * - If you specify a value of 4 or `Array.UNIQUESORT` for the `options` parameter,
         * and two or more elements being sorted have identical sort fields, a value of 0 is
         * returned and the array is not modified.
         * - If you specify a value of 8 or `Array.RETURNINDEXEDARRAY` for the `options` parameter,
         * an array is returned that reflects the results of the sort and the array is not modified.
         * - Otherwise, nothing is returned and the array is modified to reflect the sort order.
        */
        sortOn(fieldName: string | string[], options?: number | number[]): T[];

        /**
         * Adds elements to and removes elements from an array.
         * This method modifies the array without making a copy.
         */
        splice(startIndex: number, deleteCount: number, ...values: T[]): T[];

        /**
         * Returns a string that represents the elements in the specified array.
         */
        toString(): string;

        /**
         * Returns a string that represents the elements in the specified array.
         */
        toLocaleString(): string;

        /**
         * Adds one or more elements to the beginning of an array and
         * returns the new length of the array.
         */
        unshift(...argumentsList: T[]): number;
    }

    function Boolean(expression: any): boolean;

    class Boolean {
        toString(): string;

        valueOf(): boolean;
    }

    function Number(expression: any): number;

    class Number {
        static readonly MAX_VALUE: number;
        static readonly MIN_VALUE: number;
        static readonly NaN: number;
        static readonly NEGATIVE_INFINITY: number;
        static readonly POSITIVE_INFINITY: number;

        toExponential(fractionDigits: number): string;

        toFixed(fractionDigits: number): string;

        toPrecision(precision: number): string;;

        toString(radix?: number): string;

        valueOf(): boolean;
    }

    function String(expression: any): string;

    class String {
    }

    class RegExp {
    }

    class Function {
        apply(thisArg: any, argArray: any): any;

        call(thisArg: any, ...args: any[]): any;
    }

    interface IArguments {
    }

    class Error {
        readonly errorID: number;
        message: string;
        name: string;

        constructor(message?: string, id?: number);

        getStackTrace(): string;

        toString(): string;
    }

    class ArgumentError extends Error {
        constructor(message?: string);
    }

    class Class {
    }
}