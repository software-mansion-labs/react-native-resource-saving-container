# react-native-resource-saving-container

This is a very tiny React Native component that allows for saving memory by releasing resources attached to views that may are not visible on screen.

## How it works?

When native views are rendered in your React Native app, the framework creates corresponding native views and mounts them in view hierarchy. Native views provides the platform with a way how they should be rendered on screen, but a part of that they can also consume memory. For example Image component keeps a reference to a bitmap that it needs to rende, Camera component keeps the camera session active which results in increased power consumption used by camera hardware and processor unit as well as memoty consumption used for buffering. When such a views are rendered but not visible on a screen (perhaps they are few levels down navigation hierarchy) they can still take up resources they need for rendering.

`ResourceSavingContainer` allows for such a components to release their resources using technique that has been in React Native forever -- [`removeClippedSubviews`](https://facebook.github.io/react-native/docs/view.html#removeclippedsubviews) property.
This property allows for components rendered in javascript to be instantiated in native but detached from the native view hierarchy when outside of their parent's visible bounds.

## How to use it

Use `<ResourceSavingContainer/>` as a container in which you want to put resource intensive components (e.g. images, or even whole screens from navigation stack). When your components are not expected to be visible (e.g. they have been covered by other navigation card) set `visible={false}` to detach all children from native view hierarchy.

First import `<ResourceSavingContainer/>` component like this:
```js
import ResourceSavingContainer from 'react-native-resource-saving-container';
```

Then use it in your render method:
```js
    <ResourceSavingContainer
        style={{ backgroundColor: '#fcfcfc' }}
        visible={this.state.visible}>
        <Image source={require('./largeImageBackground.jpg')} />
    </ResourceSavingContainer>
```

## Sample usecases

### Custom made Tabs container

With Tabs container you want to display a few different screens (tabs) in one place on screen and allow users to switch between them from the TabBar.
One option is to render only one screen at a time and when user switches the tab we unmount the previous tab and render the new one.
With this approach when user switches the tab we loos its state (e.g. scroll position, filled input fields etc).
In order to keep component state one option is to keep previous Tab mounted in React, just hide it from user.
Although if such a screen displays video content, uses camera or displays lots of high resolution images and on top of that we have a few such screens mounted at a time we may soon run out of resources.
The solution to that problem is instead of hiding inactive tabs (e.g. using opacity or setting display property to none), we can use `<ResourceSavingContainer/>` that will take care of releasing resources when its `visible` prop is set to `false`.

Here is a short sketch of how the code for such a Tab component would look like. This is not a reacy (nor working) code but you can use it as a reference when writing your own Tabs component:
```js

class TabsContainer extends Component {
    state = {
        activeTabID: 0,
    };
    render() {
        const tabs = [
            ...Array(this.props.numerOfTabs).keys()
        ].map(tabID => (
            <ResourceSavingContainer visible={this.state.activeTabID === tabID}>
                {this.props.renderTab(tabID)}
            </ResourceSavingContainer>
        ));
        return (
            <View style={styles.container}>
                {tabs}
                <TabBar
                    numberOfTabs={this.props.numberOfTabs}
                    changeActiveTab={tabID => this.setState({ activeTabID: tabID })}>
            </View>
        )
    }
}

```


## Caveats

`<ResourceSavingContainer/>`  uses relative positioning to move its childrent outside of the visible bounds therefore children rendered directly under `ResourceSavingContainer` should not use absolute positioning. If you need absolute positioning you can render relatively positioned `<View/>` inside `<ResourceSavingContainer/>` and then use `absolute` positioning inside of that `<View/>`.

## Troubleshooting

Try searching over the issues on [GitHub here](https://github.com/SoftwareMansion/react-native-resource-saving-container/issues). If you don't find anything that would help feel free to open a new issue!

You could also just read the source code - it only has [a few lines](https://github.com/SoftwareMansion/react-native-resource-saving-container/blob/master/ResourceSavingContainer.js).