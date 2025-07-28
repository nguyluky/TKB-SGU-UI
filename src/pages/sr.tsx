import React from 'react';
import styles from './sr.module.scss';

const ShutdownPage: React.FC = () => {
    return (
        <div className={styles.shutdownPage}>
            <div className={styles.container}>
                <h1 className={styles.title}>Website đã ngừng hoạt động</h1>

                <p className={styles.message}>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>

                <p className={styles.subtitle}>Chúng tôi xin chân thành cảm ơn!</p>

                {/* Recruitment Section */}
                <div className={styles.recruitmentSection}>
                    <h2 className={styles.recruitmentTitle}>🔍 Tìm người duy trì và phát triển mới</h2>

                    <p className={styles.recruitmentText}>
                        Dự án này đang tìm kiếm những nhà phát triển tài năng để tiếp tục duy trì và phát triển. Nếu bạn
                        quan tâm đến việc tiếp quản và cải thiện hệ thống này, chúng tôi rất hoan nghênh!
                    </p>

                    <div className={styles.requirements}>
                        <h4>Yêu cầu kỹ thuật:</h4>
                        <ul>
                            <li>Kinh nghiệm với React, TypeScript</li>
                            <li>Hiểu biết về SCSS/CSS</li>
                            <li>Có kinh nghiệm với Git và GitHub</li>
                            <li>Đam mê phát triển sản phẩm cho sinh viên</li>
                        </ul>
                    </div>

                    <p className={styles.recruitmentText}>
                        Liên hệ với chúng tôi qua email:{' '}
                        <a href="mailto:nguyenkhachieu117@gmail.com" className={styles.contactEmail}>
                            nguyenkhachieu117@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShutdownPage;
