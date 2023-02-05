# Welcome to Diar.io

- Ionic: 6.20.8
- AngularFire: 7.5

This is a 10-hour web competency project. I'll use this README.md to explain myself a little and discuss parts of the app that could be done in different ways.

# Notes

## Icons

I didn't get around to doing this, but I should have put icons on all the buttons and then use a media/container query to only show the icon on small screens, but show the text and icon on larger screens.

## BaseComponent

I like to have a BaseComponent (saved in `src/app/shared/components/base.component.ts`) which has a simple `addSubscriptions` method that takes a variable list of `Subscription` and handles correctly unsubscribing from them in the `ngOnDestroy` method.

## DataModels

I like to keep data model class definitions in a separate file to the service, I've found this reduces clutter. I have included `serialize()` and `deserialize()` methods on the DataModels which I generally use for

- converting variable names (a little redundant for this project, but very necessary if the backend doesn't use camelCase),
- converting variable types (eg, converting `Firestore.Timestamp` to `Date`)
- checking validity of the incoming data (particularly with document databases like Firestore, there's the risk of older documents missing newer required fields).

These methods could equally be included in the service file as opposed to in the class definition file.

## AngularFire syntax

It seems AngularFire has just been updated but its docs haven't. For example [it suggests](https://github.com/angular/angularfire#example-use) to fetch a collection using the syntax ...

```
constructor(firestore: Firestore) {
    const collection = collection(firestore, 'items');
    this.item$ = collectionData(collection);
};
```

but then its section on querying uses the older syntax like ...

```
constructor(firestore: AngularFirestore) {
    this.items = firestore.collection('items').valueChanges();
}
```

so it's been a little confusing!
