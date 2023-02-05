# Welcome to Diar.io

- Ionic: 6.20.8
- AngularFire: 7.5

This is a 10-hour web competency project. I'll use this README.md to explain myself a little and discuss parts of the app that could be done in different ways.

# Notes

## BaseComponent

I like to have a BaseComponent (saved in `src/app/shared/components/base.component.ts`) which has a simple `addSubscriptions` method that takes a variable list of `Subscription` and handles correctly unsubscribing from them in the `ngOnDestroy` method.

## DataModels

I like to keep data model class definitions in a separate file to the service, I've found this reduces clutter. I have included `serialize()` and `deserialize()` methods on the DataModels which I generally use for

- converting variable names (a little redundant for this project, but very necessary if the backend doesn't use camelCase),
- converting variable types (eg, converting `Firestore.Timestamp` to `Date`)
- checking validity of the incoming data (particularly with document databases like Firestore, there's the risk of older documents missing newer required fields).

These methods could equally be included in the service file as opposed to in the class definition file.
