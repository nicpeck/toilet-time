const App = () => {
    const { useState, useEffect } = React;

    const searchParams = new URL(window.location).searchParams;

    const base = new Airtable({ apiKey: searchParams.get('key') }).base(searchParams.get('base'));

    const INPUT_ACTION_VALUES = [
        "Sat on toilet",
        "Wee on toilet",
        "Poo on toilet",
        "Wet undies",
        "Flood",
        "Poo in nappy",
    ];

    const Form = () => {
        const [dateValue, setDateValue] = useState('');
        const [activityOption, setActivityOption] = useState(null);
        const [dryUndiesOption, setDryUndiesOption] = useState(false);

        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(null);

        useEffect(() => {
            setDateValue(new Date().toJSON().slice(0, 16));
        }, []);

        if (loading) {
            return (
                <div className="fixed-centre text-center">
                    <div className="spinner-border" role="status" />
                    <div>Loading...</div>
                </div>
            );
        }
        if (success) {
            return (
                <div className="fixed-centre text-center">
                    <button className="btn btn-light" onClick={() => { window.location.reload(); }}>Done, start again</button>
                </div>
            );
        }

        return (
            <form className="my-4" onSubmit={(event) => {
                event.preventDefault();
                setLoading(true);
                base('Teddy toilet diary').create([
                    {
                        "fields": {
                            "Date": new Date(dateValue).toJSON(),
                            "Action": activityOption,
                            "Dry undies / nappy": dryUndiesOption
                        }
                    }
                ], function (err, records) {
                    if (err) {
                        window.alert(err.message);
                        console.error(err);
                        return;
                    }
                    setLoading(false);
                    setSuccess(true);
                });
            }}>
                <h1 className="mb-4">Toilet time</h1>

                <div className="mb-4">
                    <input
                        type="datetime-local"
                        className="form-control form-control"
                        id="input-date"
                        value={dateValue}
                        onChange={({ target }) => { setDateValue(target.value); }}
                        required
                    />
                </div>

                <div className="mb-4">
                    {INPUT_ACTION_VALUES.map(value => (
                        <div className="form-check" key={value}>
                            <label className="form-check-label">
                                <input className="form-check-input" required type="radio" name="input-activity-option" value={value} checked={activityOption === value} onChange={({ target }) => { setActivityOption(value) }} />
                                {value}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <div className="form-check">
                        <label className="form-check-label">
                            <input className="form-check-input" type="checkbox" name="input-dry-undies" checked={dryUndiesOption} onChange={({ target }) => { setDryUndiesOption(!!target.checked) }} />
                            Dry undies / nappy?
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn btn btn-primary">Save</button>
            </form>
        );
    }

    return (
        <div className="container-sm">
            <Form />
        </div>
    );
};
ReactDOM.render(
    App(),
    document.getElementById('place-app')
);
