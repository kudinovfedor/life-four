

/**
 * @param {string} url 
 * @returns {Promise}
 */
const request = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);

        xhr.onload = (e) => {
            if (xhr.status >= 200 && xhr.status <= 300) {
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch (e) {
                    resolve(xhr.responseText);
                }
            }
        }

        xhr.send();
    });
};