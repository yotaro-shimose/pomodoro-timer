export const getStringFromDate = (date: Date, format_str: string) => {

    const year_str = date.getFullYear().toString();
    //月だけ+1すること
    const month = 1 + date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const month_str = ('0' + month).slice(-2);
    const day_str = ('0' + day).slice(-2);
    const hour_str = ('0' + hour).slice(-2);
    const minute_str = ('0' + minute).slice(-2);
    const second_str = ('0' + second).slice(-2);

    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    format_str = format_str.replace(/ss/g, second_str);

    return format_str;
};