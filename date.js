
// 11 - 10 = 1
// 01 - 17 = -16
// 12 - 12 = 0
// 13 - 12 = 1

// 1584708377956
function age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    // 2019 - 1985 = 34
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    // 11 - 12 = -1
    // 11 - 11 = 0
    if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
        age = age - 1;
    }



    return age;
}