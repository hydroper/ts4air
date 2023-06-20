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

        static readonly CASEINSENSITIVE: number;
        static readonly DESCENDING: number;
        static readonly UNIQUESORT: number;
        static readonly RETURNINDEXEDARRAY: number;
        static readonly NUMERIC: number;

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
         * @param compareFunction Return cases:
         * - A negative return value specifies that `a` appears before `b` in the sorted sequence.
         * - A return value of 0 specifies that `a` and `b` have the same sort order.
         * - A positive return value specifies that `a` appears after `b` in the sorted sequence.
         * @param sortOptions Flags combining any of:
         * - `Array.CASEINSENSITIVE`
         * - `Array.DESCENDING`
         * - `Array.UNIQUESORT`
         * - `Array.RETURNINDEXEDARRAY`
         * - `Array.NUMERIC`
         * 
         * @return The return value depends on whether you pass any arguments:
         * - If you specify `Array.UNIQUESORT` for the `sortOptions` argument and two or more elements being sorted have identical sort fields, the runtime returns a value of 0 and does not modify the array.
         * - If you specify `Array.RETURNINDEXEDARRAY` for the sortOptions argument, the runtime returns a sorted numeric array of the indices that reflects the results of the sort and does not modify the array.
         * - Otherwise, the runtime returns nothing and modifies the array to reflect the sort order.
         */
        sort(compareFunction?: (a: T, b: T) => number, sortOptions?: number): T[];
    }

    function Boolean(expression: any): boolean;

    class Boolean {
    }

    function Number(expression: any): number;

    class Number {
    }

    function String(expression: any): string;

    class String {
    }

    class RegExp {
    }

    class Function {
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
}