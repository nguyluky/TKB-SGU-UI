import { MotionProps } from "framer-motion";

const motionConfig: MotionProps = {
            initial:{
                opacity: 0.5,
            },
            animate:{
                opacity: 1,
                transition: {
                    duration: 0.2,
                },
            },
            exit:{
                opacity: 0.5,
                transition: {
                    duration: 0.2,
                },
            }
};
export default motionConfig;