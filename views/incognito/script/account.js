function account(app) {
    app.search.title.style.display = 'block';
    app.search.title.textContent = 'Account';
    app.search.input.style.display = 'none';
    app.main.support = app.createElement(
        'div',
        [
            app.createElement('section', [
                app.createElement('p', '<a href="/logout">Click Here</a> to log out of your account.', {
                    style: {
                        'margin-bottom': '0'
                    }
                }),
            ], {
                class: 'data-section'
            }),

        ]);
    app.search.back.style.display = 'inline';
    app.search.back.setAttribute(
        'onclick',
        '(' + (function () {
            window.location.hash = '';
        }).toString() + ')();'
    )
};

export { account };
